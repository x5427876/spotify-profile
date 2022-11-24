import ScaleLoader from "react-spinners/ScaleLoader";

const BlockUI = ({ isOpen }) => {
    return (
        isOpen &&
        <div className="w-full md:w-[calc(100vw-100px)] h-[calc(100vh-70px)] md:h-[100vh] bg-zinc-900 flex flex-col justify-center items-center z-10">
            <ScaleLoader color="#1DB954" width="15px" height="80px" />
        </div>
    )
}

export default BlockUI