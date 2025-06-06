import { useParams } from "react-router";
import Show from "@/components/module-projects/show/Show";

const ShowPage = () => {
  const { id } = useParams();
  if (!id) {
    return null;
  }
  
  return (
    <Show id = { id }/>
  )
}

export default ShowPage;