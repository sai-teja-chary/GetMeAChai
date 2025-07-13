import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="container mx-auto flex flex-col justify-center items-center my-20 gap-5 h-50 px-4">
        <h1 className="text-3xl font-bold flex justify-center items-center">Get Me A Chai<span><img className="invert-25 w-20" src="/chai.gif" alt="" /></span></h1>
        <p className="text-center">A crowdfunding platform for creators to fund their projects.</p>
        <p className="text-center">A place where your fans can buy you a chai. Unleash the power of your fans and get your projects funded.</p>
      </div>
      <div className="bg-gray-700 h-[1px]"></div>
      <div className="flex flex-col justify-center items-center my-10 mb-20 gap-10 px-4">
        <h2 className="text-3xl font-bold text-center">Your supporters can buy you a chai...</h2>
        <div className="flex flex-col md:flex-row justify-around items-center w-full gap-10 text-center">
          <div className="flex flex-col justify-center items-center gap-2">
            <img className="w-25 rounded-full bg-gray-500 p-2 mb-2" src="/man.gif" alt="" />
            <p className="font-bold">Fans want to help</p>
            <p>Your fans are available to support you</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <img className="w-25 rounded-full bg-gray-500 p-2 mb-2" src="/coin.gif" alt="" />
            <p className="font-bold">Fans want to contribute</p>
            <p>Your fans are willing to contribute financially</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <img className="w-25 rounded-full bg-gray-500 p-2 mb-2" src="/group.gif" alt="" />
            <p className="font-bold">Fans want to collaborate</p>
            <p>Your fans are ready to collborate with you</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-700 h-[1px]"></div>
      <div className="text-white container mx-auto pb-32 pt-14 flex flex-col items-center justify-center px-4">
        <h2 className="text-3xl font-bold text-center mb-14">Learn more about us</h2>
        {/* Responsive youtube embed  */}
        <div className="w-[90%] h-[40vh] md:w-[50%] md:h-[40vh] lg:w-[50%] lg:h-[40vh] xl:w-[50%] xl:h-[40vh]">
          <iframe className="w-full h-full" src="https://www.youtube.com/embed/5IwmuaKE7tA?si=CK5Zi-yzoj3ayZ26" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>

          </div>
      
      </div>
    </>
  );
}
