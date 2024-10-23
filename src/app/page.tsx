import LandingAnimation from "@/components/landing/landingAnimation";

const Home = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="relative flex justify-center items-center w-full h-full">
        <LandingAnimation />
      </div>
    </div>
  );
};

export default Home;