import { pusherServer } from "@/lib/pusher-server";
import { CardModel } from "@/model/cards-model";
import { DepositeModel } from "@/model/deposite-model";
import { NotificationModel } from "@/model/notification-model";
import { CardOrderModel } from "@/model/order-model";
import { userModel } from "@/model/user-model";
import { dbConnect } from "@/service/mongo";

async function createFromDB(data) {
  try {
    await dbConnect();
    const { userId, cardId } = data;
    
    // Fetch user and card in parallel
    const [user, card] = await Promise.all([
      userModel.findById(userId),
      CardModel.findById(cardId)
    ]);

    // Validate resources
    if (!user) throw new Error("User not found");
    if (!card) throw new Error("Card not found");

    // Process payment
    const price = parseFloat(card.price.replace(/[^0-9.]/g, ""));
    if (user.balance < price) throw new Error("Insufficient balance");

    // Create order and update balance
    const order = await CardOrderModel.create(data);
    user.balance -= price;
    await user.save();

    // Create success notification
    const notificationPayload = {
      user: userId,
      title: `Order #${order._id.toString().slice(-6)} Created`,
      message: `Purchased ${card.bin} card for ${card.price}`,
      type: "order",
    };

    const notification = await NotificationModel.create(notificationPayload);

    return JSON.parse(JSON.stringify({ order, notification }));

  } catch (error) {
    console.error("Order creation failed:", error);

    // Create error notification if user exists
    if (userId) {
      const errorPayload = {
        user: userId,
        title: "Order Failed",
        message: error.message.includes("balance") 
          ? "Insufficient funds for purchase" 
          : "Order processing failed",
        type: "order",
      };

      await NotificationModel.create(errorPayload)
        .catch(err => console.error("Notification save error:", err));
    }

    throw error;
  }
}

async function getFromDB(userId) {
  try {
    await dbConnect();

    // Fetch all orders for the user
    const orders = await CardOrderModel.find({ userId }).lean();

    // Get all unique card IDs from the orders
    const cardIds = orders.map((order) => order.cardId);

    // Fetch all cards associated with these orders in a single query
    const cards = await CardModel.find({
      _id: { $in: cardIds },
    }).lean();

    // Create a map of cards for quick lookup
    const cardMap = new Map();
    cards.forEach((card) => {
      cardMap.set(card._id.toString(), card);
    });

    // Combine orders with their card data
    const ordersWithCards = orders.map((order) => ({
      ...order,
      card: cardMap.get(order.cardId.toString()),
    }));

    return JSON.parse(JSON.stringify(ordersWithCards));
  } catch (error) {
    console.error("Error in getFromDB:", error);
    throw error;
  }
}

async function getAllFromDB() {
  try {
    await dbConnect();

    // Fetch all orders, users, and cards in parallel
    const [orders, users, cards] = await Promise.all([
      CardOrderModel.find({}).sort({ createdAt: -1 }).lean(),
      userModel.find({}).sort({ createdAt: -1 }).lean(),
      CardModel.find({}).sort({ createdAt: -1 }).lean(),
    ]);

    // Create maps for quick lookup
    const cardMap = new Map(cards.map((card) => [card._id.toString(), card]));
    const userMap = new Map(users.map((user) => [user._id.toString(), user]));

    // Combine all data
    const ordersWithDetails = orders.map((order) => {
      const card = cardMap.get(order.cardId?.toString());
      const user = userMap.get(order.userId?.toString());

      return {
        ...order,
        card: card || null, // Return null if card not found
        user: {
          // Only include necessary user info
          name: user?.name,
          telegramId: user?.telegramId,
        },
      };
    });

    return JSON.parse(JSON.stringify(ordersWithDetails));
  } catch (error) {
    console.error("Error in getAllFromDB:", error);
    throw error;
  }
}

async function deleteFromDB(id) {
  await dbConnect();
  const categories = await CardOrderModel.findByIdAndDelete(id).lean();
  return JSON.parse(JSON.stringify(categories));
}

async function updateFromDB(id, updateData) {
  try {
    await dbConnect();

    // Find the existing order first to compare changes
    const existingOrder = await CardOrderModel.findById(id).lean();
    if (!existingOrder) {
      throw new Error("Order not found");
    }

    // Perform the update
    const updatedOrder = await CardOrderModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return the updated document
    ).lean();

    // Determine what changed for the notification
    const changes = [];
    if (updateData.status && updateData.status !== existingOrder.status) {
      changes.push(
        `Status changed from ${existingOrder.status} to ${updateData.status}`
      );
    }
    if (
      updateData.adminNotes &&
      updateData.adminNotes !== existingOrder.adminNotes
    ) {
      changes.push("Admin notes updated");
    }

    // Only create notification if there were meaningful changes
    if (changes.length > 0) {
      const notificationPayload = {
        user: existingOrder.userId,
        title: `Order #${id.toString().slice(-6)} Updated`,
        message: `Your order has been updated: ${changes.join(", ")}`,
        type: "order",
        relatedEntity: "order",
        relatedEntityId: id,
        priority: updateData.status === "Cancelled" ? "high" : "medium",
        metadata: {
          oldStatus: existingOrder.status,
          newStatus: updatedOrder.status,
          actionUrl: `/orders/${id}`,
        },
      };

      // Create notification and trigger real-time update in parallel
      await Promise.all([
        Notification.create(notificationPayload),
        pusherServer.trigger(`user-${existingOrder.userId}`, "order-updated", {
          ...notificationPayload,
          timeAgo: "Just now",
          orderId: id,
        }),
      ]);
    }

    // Also trigger general update for admin views
    await pusherServer.trigger("orders-channel", "order-updated", {
      orderId: id,
      status: updatedOrder.status,
    });

    return {
      ...JSON.parse(JSON.stringify(updatedOrder)),
      notification:
        changes.length > 0
          ? {
              success: true,
              message: "Order updated with notifications sent",
            }
          : {
              success: true,
              message: "Order updated (no notifications needed)",
            },
    };
  } catch (error) {
    console.error("Update failed:", error);

    // Create error notification if we have the order ID
    if (id) {
      const errorOrder = await CardOrderModel.findById(id).lean();
      if (errorOrder?.userId) {
        await NotificationModel.create({
          user: errorOrder.userId,
          title: "Order Update Failed",
          message: `System failed to update your order: ${error.message}`,
          type: "order",
          priority: "critical",
          metadata: {
            errorCode: "UPDATE_FAILED",
            retryUrl: `/orders/${id}`,
          },
        }).catch((notifError) =>
          console.error("Notification failed:", notifError)
        );
      }
    }

    throw {
      ...error,
      notification: {
        success: false,
        message: error.message,
      },
    };
  }
}
export const cardOrderQuery = {
  createFromDB,
  getAllFromDB,
  getFromDB,
  deleteFromDB,
  updateFromDB,
};
