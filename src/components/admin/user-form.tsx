"use client";

import { useState, useEffect } from "react";
import type { User, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  initialData?: User | null;
}

export function UserForm({ isOpen, onClose, onSave, initialData }: UserFormProps) {
  const [user, setUser] = useState<Partial<User>>(initialData || { role: "Researcher"});

  useEffect(() => {
    setUser(initialData || { role: "Researcher"});
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: UserRole) => {
    setUser(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = () => {
    if (user.name && user.email && user.role) {
      onSave(user as User); // Assuming ID is handled by parent or backend
    } else {
      alert("Name, Email, and Role are required.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit" : "Add New"} User</DialogTitle>
          <DialogDescription>
            {initialData ? "Update the user's details and role." : "Enter the details for the new user."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" name="name" value={user.name || ""} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" name="email" type="email" value={user.email || ""} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Role</Label>
            <Select value={user.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Researcher">Researcher</SelectItem>
                <SelectItem value="Reviewer">Reviewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
           {(!initialData || !user.id) && ( // Only show for new users, or if password reset is separate
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Set initial password" onChange={handleChange} className="col-span-3" />
            </div>
           )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Save User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
