import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  exportToImage,
  loadFile,
  saveCanvas,
  saveToFile,
  updateCanvas,
} from "@/lib/utils";
import { Alert } from "./Alert";
import { useState } from "react";

import axios, { GET_CONFIG, POST_CONFIG } from "@/api/axios";
import { Canvas } from "@/types/type";
import { getUser } from "@/helper/getUser";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { logout, selectUser } from "@/store/UserSlice";
import { useDispatch } from "react-redux";
import { setCanvasId } from "@/store/CanvasSlice";

export const MenubarNavigation = ({
  canvas,
  handleUndo,
  handleRedo,
  handleClearAll,
}: {
  canvas: fabric.Canvas | null;
  handleUndo: () => void;
  handleRedo: () => void;
  handleClearAll: () => void;
}) => {
  const user = useSelector(selectUser);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const selectedCanvas = useSelector((state: any) => state.canvas);
  const selectedCanvasId = useSelector((state: any) => state.canvas.id);

  const handleLoadFile = () => {
    loadFile(canvas);
    setIsAlertOpen(false);
  };

  const handleSaveToImage = (format: string) => {
    if (canvas) {
      canvas.discardActiveObject().renderAll();
      exportToImage(format);
      saveCanvas(canvas, user.id);
    }
  };

  const handleSaveToFile = async () => {
    if (canvas) {
      saveToFile(canvas);
    }
  };

  const dispatch = useDispatch();

  const handleSaveProject = async (saveType: string) => {
    const resp = await axios.get(`/canvas/user/${user.id}`, GET_CONFIG);

    if (resp.status === 200 && canvas) {
      const project = resp.data.filter((canvas: Canvas) => {
        return canvas.id === selectedCanvasId;
      });
      if (saveType == "old") {
        updateCanvas(canvas, project[0].id, project[0].name);
      } else {
        const id = await saveCanvas(canvas, user.id);
        console.log(id);

        dispatch(setCanvasId(id));
      }
    }
  };

  // console.log(user);

  const handleLogout = () => {
    localStorage.removeItem("user");
    // setUser(null);
    dispatch(logout());
  };

  return (
    <Menubar className="flex flex-row justify-between border-b-1.5 border-gray-300 rounded-none">
      <div className="flex flex-row justify-between">
        <Link to="/" className="flex flex-row gap-2 items-center">
          <img
            src="favicon.svg"
            alt="WhiteCanvas Logo"
            className="w-[36px] h-[36px] mx-2 "
          />
        </Link>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={handleClearAll}>New File</MenubarItem>
            <MenubarItem onClick={() => setIsAlertOpen(!isAlertOpen)}>
              Load
            </MenubarItem>
            <MenubarSeparator />
            {/* <MenubarItem onClick={handleSaveProject}>
              Save Project <MenubarShortcut>⌘ Shift S</MenubarShortcut>
            </MenubarItem> */}
            <MenubarSub>
              <MenubarSubTrigger>Save Project</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem onClick={() => handleSaveProject("new")}>
                  as New file
                </MenubarItem>
                {selectedCanvasId.length > 0 && (
                  <MenubarItem onClick={() => handleSaveProject("old")}>
                    as Old file
                  </MenubarItem>
                )}
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Save as</MenubarSubTrigger>
              <MenubarSubContent>
                {/* <MenubarItem onClick={handleSaveToImage}>as Image</MenubarItem> */}
                <MenubarSub>
                  <MenubarSubTrigger>as Image</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem onClick={() => handleSaveToImage("png")}>
                      as PNG
                    </MenubarItem>
                    <MenubarItem onClick={() => handleSaveToImage("jpg")}>
                      as JPG
                    </MenubarItem>
                    <MenubarItem onClick={() => handleSaveToImage("jpeg")}>
                      as JPEG
                    </MenubarItem>
                    <MenubarItem onClick={() => handleSaveToImage("webp")}>
                      as WEBP
                    </MenubarItem>
                    <MenubarItem onClick={() => handleSaveToImage("pdf")}>
                      as PDF
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarItem onClick={handleSaveToFile}>
                  as Project File
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>
              Print... <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={handleUndo}>
              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={handleRedo}>
              Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Find</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Search the web</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Find...</MenubarItem>
                <MenubarItem>Find Next</MenubarItem>
                <MenubarItem>Find Previous</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>Cut</MenubarItem>
            <MenubarItem>Copy</MenubarItem>
            <MenubarItem>Paste</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>
              Always Show Full URLs
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem inset>
              Reload <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled inset>
              Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Toggle Fullscreen</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Hide Sidebar</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Profiles</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value="benoit">
              <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
              <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
              <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarItem inset>Edit...</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Add Profile...</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </div>

      <div className="flex flex-row gap-2 items-center">
        {user.id ? (
          <div className="flex flex-row items-center gap-2">
            <Link to="/profile">{user.name}</Link>
            <Button className="max-h-[30px]" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <div>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </div>
        )}
      </div>

      <Alert
        title="Are you sure?"
        description="All unsaved changes will disappear"
        onClickConfirm={handleLoadFile}
        setIsOpen={setIsAlertOpen}
        isOpen={isAlertOpen}
      />
    </Menubar>
  );
};
