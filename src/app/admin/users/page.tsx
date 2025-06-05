"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserTable } from "@/components/admin/user-table";
import { UserForm } from "@/components/admin/user-form";
import type { User, UserRole } from "@/types";
import { PlusCircle, Search, Filter } from "lucide-react";

const initialUsers: User[] = [
  { id: "U001", name: "Alice Wonderland", email: "alice@example.gov.br", role: "Admin" },
  { id: "U002", name: "Bob The Builder", email: "bob@example.gov.br", role: "Researcher" },
  { id: "U003", name: "Carol Danvers", email: "carol@example.gov.br", role: "Reviewer" },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleSaveUser = (user: User) => {
    if (user.id) { // Editing existing
      setUsers(users.map(u => u.id === user.id ? user : u));
    } else { // Adding new
      const newUser = { ...user, id: `U${String(users.length + 1).padStart(3, '0')}` };
      setUsers([...users, newUser]);
    }
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold font-headline">User Management</h1>
          <Button onClick={() => { setEditingUser(null); setIsFormOpen(true); }}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>User List</CardTitle>
            <CardDescription>Manage application users and their roles.</CardDescription>
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search by name or email..." 
                  className="pl-8 w-full sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter by Role
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredUsers.length > 0 ? (
                 <UserTable users={filteredUsers} onEdit={handleEdit} onDelete={handleDelete} />
            ) : (
                <p className="text-center text-muted-foreground py-8">No users found.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <UserForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveUser}
        initialData={editingUser}
      />
    </AppLayout>
  );
}
