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
import { exportToImage, loadFile, saveCanvas, saveToFile } from "@/lib/utils";
import { Alert } from "./Alert";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/UserSlice";
import axios, { POST_CONFIG } from "@/api/axios";

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

  const handleLoadFile = () => {
    loadFile(canvas);
    setIsAlertOpen(false);
  };

  const handleSaveToImage = () => {
    canvas?.discardActiveObject().renderAll();
    exportToImage();
    saveCanvas(canvas, user.id);
  };

  const handleSaveToFile = () => {
    saveToFile(canvas);
    saveCanvas(canvas, user.id);
  };

  const handleSaveProject = async () => {
    const data = {
      name: '1',
      description: '1',
      userId: user.id,
      canvasJSON: JSON.stringify(canvas),
    };
    const resp = await axios.post('/canvas/create', data, POST_CONFIG);
    console.log(resp);
    
  }

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={handleClearAll}>New File</MenubarItem>
          <MenubarItem onClick={() => setIsAlertOpen(!isAlertOpen)}>
            Load
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={handleSaveProject}>
            Save Project <MenubarShortcut>⌘ Shift S</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Save as</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem onClick={handleSaveToImage}>as Image</MenubarItem>
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
