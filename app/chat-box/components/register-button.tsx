"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, File, UserPlus, LogIn, Menu, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DemoCreateAccount() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-4 w-full justify-start">
            <LogIn className="w-4 h-4 mr-2" />
            Register
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">username</Label>
              <Input
                id="username"
                type="username"
                placeholder="m@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">password</Label>
              <Input id="password" type="password" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button">Login</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
