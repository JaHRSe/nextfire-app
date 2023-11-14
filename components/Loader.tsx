export default function Loader({ show }: { show: Boolean }) {
  return show ? <div className="loader"></div> : null;
}
