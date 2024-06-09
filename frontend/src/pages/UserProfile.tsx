import axios, { GET_CONFIG } from "@/api/axios";
import { useEffect, useState } from "react";
import { selectUser } from "@/store/UserSlice";
import { useSelector } from "react-redux";
import { Canvas } from "@/types/type";
import { Button } from "@/components/ui/button";
import ProjectPreview from "@/components/ProjectPreview";
import { useNavigate } from "react-router-dom";
import { clearAll, setCanvas, setCanvasId } from "@/store/CanvasSlice";
import { useDispatch } from "react-redux";
import { loadFile } from "@/lib/utils";

const UserProfile = () => {
  const user = useSelector(selectUser);
  const [allProjects, setAllProjects] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getCanvas = async () => {
    const resp = await axios.get(`/canvas/user/${user.id}`, GET_CONFIG);
    if (resp.status === 200) {
      setAllProjects(resp.data);
    }
  };

  useEffect(() => {
    getCanvas();
  }, []);

  const openCanvas = (canvasJSON: string, id: string) => {
    const canvas = {
      canvasJSON: canvasJSON,
      canvasId: id,
    };
    dispatch(setCanvas(canvas.canvasJSON));
    dispatch(setCanvasId(id));
    navigate("/");
  };

  const handleClearAll = () => {
    dispatch(clearAll());
    navigate('/');
  };

  return (
    <div className="flex flex-col gap-4 px-12 mt-2">
      <div className="flex gap-2">
        <Button className="bg-slate-400" onClick={handleClearAll}>New project</Button>
      </div>
      <div className="flex flex-wrap gap-5">
        {allProjects.length > 0 &&
          allProjects.map((canvas: Canvas, index) => (
            <div
                key={index}
                className="group flex flex-col gap-2 relative cursor-pointer"
                onDoubleClick={() => openCanvas(canvas.canvasJSON, canvas.id)}
            >
              <ProjectPreview canvas={canvas} index={index} openCanvas={openCanvas} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserProfile;
