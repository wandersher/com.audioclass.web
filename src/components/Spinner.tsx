import Lottie from "react-lottie-player";
import animation from "../assets/loading.json";

type LoadingViewProps = {
  show?: boolean;
  size?: string | number;
  style?: React.CSSProperties;
};
export default function LoadingView({ show, size = 48, style = {} }: LoadingViewProps) {
  if (show != undefined && !show) return null;
  return <Lottie animationData={animation} play loop style={{ ...style, width: size, height: size }} />;
}
