import ScaleLoader from "react-spinners/ScaleLoader";

const BlockUI = ({ isOpen }) => {
  return (
    isOpen && (
      <div className="w-full h-[calc(100vh-70px)] md:h-[100vh] md:w-[calc(100vw-100px)] bg-zinc-900 flex flex-col justify-center items-center z-20 absolute top-0 md:left-[100px]">
        <ScaleLoader color="#1DB954" width="15px" height="80px" />
      </div>
    )
  );
};
export default BlockUI;
