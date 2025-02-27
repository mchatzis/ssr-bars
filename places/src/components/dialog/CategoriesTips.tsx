'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface CategoriesTipsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CategoriesTips({ open, onOpenChange }: CategoriesTipsProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Welcome</DialogTitle>
                    <DialogDescription>
                        It seems this is your first time here. Let us give you some usage tips.
                        ...
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
