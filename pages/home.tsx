import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export const getServerSideProps = async (context) => {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );

    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    return {
        props: {

        },
    };
}

export default function Home({ userInfo }) {
    return (
        <div className="w-[100vw] h-[100vh] bg-zinc-900">
            {/* <div className="flex flex-col justify-center items-center h-[50vh]">
                <img src={userData?.user?.image} alt='user-avatar' className="rounded-full w-[150px]" />
                <div className="text-white text-5xl font-bold mt-8">{userData?.user?.name}</div>
            </div> */}
        </div>
    );
}

