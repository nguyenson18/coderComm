import { useContext } from "react";
import { OnlineContext } from "../contexts/OnlineContext";

const useOnline = () => {
  return useContext(OnlineContext);
};

export default useOnline;
