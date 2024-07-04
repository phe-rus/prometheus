'use client'

import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

export type PreviewProps = {
    children: React.ReactNode;
    isFile?: boolean;
    className?: string;
}

export const Preview = ({ children, isFile, className }: PreviewProps) => {
    if (!isFile) {
        return (
            <>
                {children}
            </>
        )
    }
    return (
        <Dialog>
            <DialogTrigger asChild className={className}>
                {children}
            </DialogTrigger>

            <DialogContent className="size-[95%] min-w-[98%]">
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}