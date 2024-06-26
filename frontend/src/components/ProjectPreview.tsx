import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCanvasInfo } from "@/lib/utils";
import { setCanvas } from "@/store/CanvasSlice";
import { useDispatch } from "react-redux";
import { Canvas } from '@/types/type';
import { useSelector } from 'react-redux';
import axios, { GET_CONFIG } from '@/api/axios';
import { selectUser } from "@/store/UserSlice";
import { Button } from './ui/button';

type ProjectPreview = {
    index: number,
    canvas: Canvas,
    openCanvas: (canvasJSON: string, id: string) => void
}

const ProjectPreview = ({ canvas, openCanvas } :  ProjectPreview) => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const selectedCanvas = useSelector((state: any) => state.canvas);
  
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");

    const handleUpdate = (canvas: Canvas) => {
        updateCanvasInfo(canvas.canvasJSON, canvas.id, newTitle, newDesc);
        window.location.reload();
    };

    const handleDelete = async (canvasId: string) => {
        if (selectedCanvas.id == canvasId) {
        const firstCanvas = await axios.get(
            `/canvas/user/${user.id}`,
            GET_CONFIG
        );
        dispatch(setCanvas(firstCanvas.data[0]));
        }
        await axios.delete(`/canvas/delete/${canvasId}`);
        window.location.reload();
    };

    const getLastEdit = (editDate: Date) => {
        const now = new Date();
        const edit = new Date(editDate);
        const diff = now.getTime() - edit.getTime();
    
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
    
        if (months > 0) {
          return `${months} ${months === 1 ? "month" : "month"}`;
        } else if (weeks > 0) {
          return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
        } else if (days > 0) {
          return `${days} ${days === 1 ? "day" : "days"}`;
        } else if (hours > 0) {
          return `${hours} ${hours === 1 ? "hour" : "hours"}`;
        } else if (minutes > 0) {
          return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
        } else {
          return `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
        }
    };

    return (
        <>
            <div className="w-[200px] md:w-[400px] h-[100px] md:h-[250px] flex items-center justify-center rounded-[13px] border-[2px]">
                <img
                    src={canvas.imageURL}
                    alt=""
                    className="max-w-[100%] max-h-[100%]"
                />
                <div
                    className={`absolute top-2 right-2 border-[2px] rounded-[8px]`}
                >
                <DropdownMenu>
                    <DropdownMenuTrigger className="pb-2 px-2 outline-none">
                    ...
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                    <DropdownMenuLabel className="cursor-pointer">
                        <Dialog>
                        <DialogTrigger className="w-[100%] text-left outline-none">
                            Edit
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                            <DialogTitle>Edit project</DialogTitle>
                            <DialogDescription>
                                Make changes to your project here. Click save when
                                you're done.
                            </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">
                                Title
                                </Label>
                                <Input
                                id="title"
                                defaultValue={newTitle}
                                className="col-span-3"
                                onChange={(e) => setNewTitle(e.target.value)}
                                required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                htmlFor="description"
                                className="text-right"
                                >
                                Description
                                </Label>
                                <Input
                                id="description"
                                defaultValue={newDesc}
                                className="col-span-3"
                                onChange={(e) => setNewDesc(e.target.value)}
                                />
                            </div>
                            </div>
                            <DialogFooter>
                            <Button onClick={() => handleUpdate(canvas)}>
                                Save changes
                            </Button>
                            </DialogFooter>
                        </DialogContent>
                        </Dialog>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel
                        className="cursor-pointer text-red-500"
                        onClick={() => handleDelete(canvas.id)}
                    >
                        Delete
                    </DropdownMenuLabel>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
            </div>
            <div
                className="ml-2"
                onClick={() => openCanvas(canvas.canvasJSON, canvas.id)}
            >
                <div className="font-[500] cursor-pointer">{canvas.name}</div>
                <div className="text-gray-700 text-[14px]">{`Edit ${getLastEdit(
                canvas.updatedAt
                )} ago`}</div>
            </div>
        </>
    )
}

export default ProjectPreview
