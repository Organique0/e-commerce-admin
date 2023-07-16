import { BounceLoader, HashLoader } from "react-spinners";

export default function Spinner(props) {
  return <HashLoader color={'#5542F6'} speedMultiplier={2} className={props.fullwidth ? "m-auto w-full": ""}/>;
}
