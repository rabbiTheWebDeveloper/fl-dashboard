"use client";
import React, { useState } from "react";
import { jsPDF } from "jspdf";

const mockBillingData = [
  //   {
  //     id: "INV001",
  //     date: "2025-11-03",
  //     customer: "John Doe",
  //     amount: 1500,
  //     items: [
  //       { name: "Product A", qty: 2, price: 500 },
  //       { name: "Product B", qty: 1, price: 500 },
  //     ],
  //   },
  //   {
  //     id: "INV002",
  //     date: "2025-11-02",
  //     customer: "Jane Smith",
  //     amount: 2200,
  //     items: [
  //       { name: "Product C", qty: 2, price: 1000 },
  //       { name: "Product D", qty: 1, price: 200 },
  //     ],
  //   },
];

const Billing = () => {
  const [billingData, setBillingData] = useState(mockBillingData);

  const downloadInvoice = (invoice) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);

    doc.setFontSize(12);
    doc.text(`Invoice ID: ${invoice.id}`, 14, 30);
    doc.text(`Date: ${invoice.date}`, 14, 38);
    doc.text(`Customer: ${invoice.customer}`, 14, 46);

    doc.text("Items:", 14, 56);

    let y = 64;
    invoice.items.forEach((item, idx) => {
      doc.text(
        `${idx + 1}. ${item.name} - Qty: ${item.qty} - Price: ${item.price}`,
        14,
        y
      );
      y += 8;
    });

    doc.text(`Total Amount: ${invoice.amount}`, 14, y + 4);

    doc.save(`${invoice.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-semibold mb-6">Billing List</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {billingData.length > 0 ? (
              billingData.map((bill) => (
                <tr key={bill.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{bill.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{bill.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {bill.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{bill.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => downloadInvoice(bill)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                >
                  No billing records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billing;
