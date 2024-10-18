"use client";

import { Button } from "@/components/ui/button";
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
import { LogIn } from "lucide-react";
import { useState } from "react";

export default function Login({ onLogin }: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="mb-4 w-full justify-start"
        onClick={() => setOpen(true)}
      >
        <LogIn className="w-4 h-4 mr-2" />
        Login
      </Button>
      <Dialog modal={true} open={open} onOpenChange={setOpen}>
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
              <Input id="username" type="username" placeholder="username" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">password</Label>
              <Input id="password" type="password" placeholder="password" />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                onLogin();
                setOpen(false);
              }}
            >
              Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
