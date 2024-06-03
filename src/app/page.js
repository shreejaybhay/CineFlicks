import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
    return (
        <div>
        <Navbar />
            <div className="relative flex items-center justify-center w-full h-[calc(100vh-72px)] overflow-hidden bg-gray-900">
                <div className="absolute inset-0">
                    <Image
                        src="https://assets.nflxext.com/ffe/siteui/vlv3/dd4dfce3-1a39-4b1a-8e19-b7242da17e68/86742114-c001-4800-a127-c9c89ca7bbe4/IN-en-20240527-popsignuptwoweeks-perspective_alpha_website_large.jpg" // Replace with the path to your background image
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        alt="Background Image"
                        className="opacity-50"
                    />
                    <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
                </div>
                <div className="relative px-4 py-20 sm:px-6 lg:px-8">
                    <div className="mx-auto text-center max-w-7xl">
                        <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                            Welcome to CineFlicks
                        </h1>
                        <p className="mt-3 text-lg text-gray-300 sm:mt-4">
                            Your go-to destination for all things movies.
                        </p>
                        <div className="mt-10">
                            <a
                                href="signup"
                                className="inline-block px-8 py-3 text-lg font-semibold text-white bg-indigo-500 rounded-full hover:bg-indigo-600"
                            >
                                Explore Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
