"use client";

import React, { useState } from "react";
import {
  Crown,
  Mail,
  Plus,
  Settings,
  Shield,
  Trash2,
  User,
  UserCog,
  Users,
} from "lucide-react";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ManageUsers({ user }) {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState(() =>
    user && (user.id || user.email) ? [user] : []
  );
  const [newUser, setNewUser] = useState({ email: "", role: "" });

  const handleAddUser = () => {
    if (!newUser.email.trim() || !newUser.role) {
      toast.error("Please enter an email and select a role");
      return;
    }

    setUsers((prev) => [
      ...prev,
      {
        id: Date.now(),
        fullName:
          newUser.email
            .split("@")[0]
            .replace(/[^a-zA-Z0-9]/g, " ")
            .trim() || "Team Member",
        email: newUser.email.trim(),
        role: newUser.role,
        avatar: null,
      },
    ]);
    setNewUser({ email: "", role: "" });
    setShowModal(false);
    toast.success("Team member invited!");
  };

  const handleRemoveUser = (userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    toast.info("Team member removed");
  };

  const getRoleBadge = (role) => {
    if (role === "merchant" || role === "Shop Owner") {
      return {
        label: "Shop Owner",
        icon: Crown,
        cls: "bg-violet-500/10 text-violet-700 border-violet-200",
      };
    }
    if (role === "Shop Manager") {
      return {
        label: "Shop Manager",
        icon: Settings,
        cls: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
      };
    }
    return {
      label: role || "Shop Staff",
      icon: UserCog,
      cls: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
    };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Team & <span className="rgb-gradient-text">Permissions</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Collaborate securely with managers and order-fulfillment staff.
          </p>
        </div>
        <Button variant="gradient" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Invite Member
        </Button>
      </div>

      <Card className="rgb-card border-slate-200/80 bg-white/95">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600 text-white flex items-center justify-center shadow-md">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">
                Workspace Members ({users.length})
              </CardTitle>
              <CardDescription>
                Active accounts with access to this store
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <User className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium text-slate-600">
                No team members found
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 overflow-hidden">
              {users.map((member, idx) => {
                const roleMeta = getRoleBadge(member?.role);
                const RoleIcon = roleMeta.icon;
                const isOwner = member?.role === "merchant";
                return (
                  <div
                    key={member?.id || idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Avatar className="h-11 w-11 rounded-xl border border-slate-200">
                        <AvatarImage src={member?.avatar || ""} alt={member?.fullName} />
                        <AvatarFallback className="rounded-xl bg-gradient-to-br from-violet-600/15 to-cyan-500/15 text-violet-700 font-bold">
                          {(member?.fullName?.[0] || "U").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 truncate">
                            {member?.fullName || "Merchant"}
                          </p>
                          {isOwner && (
                            <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-200 text-[10px]">
                              Owner
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
                          <Mail className="w-3 h-3 shrink-0" />
                          {member?.email || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Badge variant="outline" className={`gap-1.5 py-1 px-2.5 ${roleMeta.cls}`}>
                        <RoleIcon className="w-3.5 h-3.5" />
                        {roleMeta.label}
                      </Badge>
                      {!isOwner && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          onClick={() => handleRemoveUser(member.id)}
                          aria-label="Remove user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Grant role-based dashboard access to your staff
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="staff@example.com"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-violet-600" />
                Role
              </Label>
              <Select
                value={newUser.role}
                onValueChange={(v) => setNewUser({ ...newUser, role: v })}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select a role..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Shop Manager">Shop Manager</SelectItem>
                  <SelectItem value="Shop Staff">Shop Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              variant="gradient"
              onClick={handleAddUser}
              disabled={!newUser.email || !newUser.role}
            >
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
