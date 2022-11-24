import ScaleLoader from "react-spinners/ScaleLoader";

const BlockUI = ({ isOpen }) => {
    return (
        isOpen &&
        <div className="w-[calc(100vw-100px)] h-[100vh] bg-zinc-900 flex flex-col justify-center items-center z-10">
            <ScaleLoader color="#1DB954" width="15" height="80" />
        </div>
    )
}

export default BlockUI