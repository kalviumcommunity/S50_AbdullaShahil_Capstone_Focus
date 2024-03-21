import * as React from "react";

const ProfileHeader = () => {
  return (
    <header className="flex overflow-hidden relative flex-col px-20 pt-20 pb-10 w-full text-2xl font-semibold text-white min-h-[300px] max-md:px-5 max-md:max-w-full">
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/cbe4e05fec4191be5ce1912287b0c6b25edc24e259c2452c9e08e903a35c7328?apiKey=be5488dfd1434e23b07d8d211054ee7c&" alt="Background" className="object-cover absolute inset-0 size-full" />
      <h1 className="relative z-10 self-start ml-11 text-5xl max-md:ml-2.5 max-md:text-4xl">ClickSphere</h1>
      <nav className="relative z-10 self-end mt-0 mr-12 max-md:mr-2.5">About</nav>
      <nav className="relative self-end mt-0 mr-72 max-md:mr-2.5">Home</nav>
      <h2 className="relative self-center mt-24 text-7xl font-bold leading-[100px] max-md:mt-10 max-md:text-4xl max-md:leading-[57px]">
        Profile
        <br />
      </h2>
    </header>
  );
};

const ProfileCard = () => {
  return (
    <div className="flex flex-col px-11 py-8 w-full bg-white rounded-xl border border-black border-solid shadow-[0px_4px_15px_rgba(0,0,0,0.14)] max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <div className="px-px max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <div className="flex flex-col w-[83%] max-md:ml-0 max-md:w-full">
            <div className="flex grow gap-5 text-3xl font-semibold leading-9 whitespace-nowrap text-neutral-800 max-md:mt-10">
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/ad45566e805d85fa34d1304b54248373235afd6e850e3f40d5e06ff735f906b5?apiKey=be5488dfd1434e23b07d8d211054ee7c&" alt="Profile" className="shrink-0 max-w-full rounded-full border border-solid aspect-[0.95] border-zinc-500 w-[105px]" />
              <div className="flex-auto my-auto">tommy_1</div>
            </div>
          </div>
          <div className="flex flex-col ml-5 w-[17%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col justify-center items-start self-stretch px-12 py-1 my-auto -ml-px w-full bg-lime-600 shadow-sm rounded-[120px] max-md:pl-5 max-md:mt-10">
              <div className="shrink-0 bg-white rounded-full h-[38px] w-[38px]" />
            </div>
          </div>
        </div>
      </div>
      <div className="justify-center items-start px-9 py-8 mt-12 text-xl font-light leading-7 rounded-md border border-solid bg-stone-50 border-neutral-300 text-stone-900 max-md:px-5 max-md:mt-10 max-md:max-w-full">
        Tommy Meg
      </div>
      <div className="justify-center items-start px-9 py-8 mt-7 text-xl font-light leading-7 whitespace-nowrap rounded-md border border-solid bg-stone-50 border-neutral-300 text-stone-900 max-md:px-5 max-md:max-w-full">
        tommymeg@gmail.com
      </div>
      <div className="justify-center items-start px-9 py-9 mt-7 text-xl font-light leading-7 whitespace-nowrap rounded-md border border-solid bg-stone-50 border-neutral-300 text-stone-900 max-md:px-5 max-md:max-w-full">
        Male
      </div>
      <div className="flex gap-3 mt-5 text-2xl font-semibold text-white max-md:flex-wrap">
        <button className="justify-center px-11 py-5 rounded-lg bg-stone-900 max-md:px-5">Edit Profile</button>
        <button className="grow justify-center px-12 py-5 bg-amber-500 rounded-lg w-fit max-md:px-5">Change Password</button>
      </div>
      <hr className="shrink-0 self-center mt-8 max-w-full h-px bg-neutral-200 w-[435px]" />
      <button className="justify-center items-center px-12 py-4 mt-7 text-2xl font-semibold text-white bg-orange-600 rounded-lg max-md:px-5 max-md:max-w-full">
        Delete Account
      </button>
    </div>
  );
};

const PostCard = () => {
  return (
    <article className="flex flex-col px-4 py-7 mt-16 bg-white rounded-xl border border-solid border-stone-300 shadow-[0px_4px_15px_rgba(0,0,0,0.28)] max-md:mt-10 max-md:max-w-full">
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/a2f076ab69d3b138bfd097ad3a3f45c47f5efdb9f09d54f0c4c420fcdbe322b9?apiKey=be5488dfd1434e23b07d8d211054ee7c&" alt="Post" className="w-full border border-black border-solid aspect-[1.27] max-md:max-w-full" />
      <div className="flex gap-5 mt-6 text-3xl text-black max-md:flex-wrap max-md:pr-5 max-md:max-w-full">
        <h3 className="flex-auto my-auto">Waving fingers on typewriter</h3>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/b20eb4eb629e9abee5efde8e54cb96ea280e85666a10c2f25c581fa94ae61e6c?apiKey=be5488dfd1434e23b07d8d211054ee7c&" alt="Like" className="shrink-0 aspect-square w-[51px]" />
      </div>
      <p className="mx-12 mt-3.5 text-xl font-light text-neutral-400 max-md:mr-2.5 max-md:max-w-full">
        Click Sphere, your ultimate online platform for photographers. Showcase your creativity, connect with peers, and elevate your craft. Upload your best shots and collaborate seamlessly.
        <br />
      </p>
    </article>
  );
};

const ActionButtons = () => {
  return (
    <div className="flex flex-col self-start mt-28 max-md:mt-10">
      <button className="flex justify-center items-center px-7 bg-amber-500 rounded-full h-[86px] w-[86px] max-md:px-5">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/c010e0028622855cc098387ead945262fb310621162381c9b4b72c0fe6134a4b?apiKey=be5488dfd1434e23b07d8d211054ee7c&" alt="Add Post" className="aspect-square w-[31px]" />
      </button>
      <button className="flex justify-center items-center px-7 mt-3.5 bg-orange-600 rounded-full h-[86px] w-[86px] max-md:px-5">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/3b857bc82747f9af1cbe758475d7a7e8dcee3bb8ae1c9bfa77effceb4753e380?apiKey=be5488dfd1434e23b07d8d211054ee7c&" alt="Settings" className="aspect-square w-[30px]" />
      </button>
    </div>
  );
};

function MyComponent() {
  return (
    <div className="flex flex-col pb-14 bg-white">
      <ProfileHeader />
      <main className="z-10 self-center mt-0 w-full max-w-[1705px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <section className="flex flex-col w-[42%] max-md:ml-0 max-md:w-full">
            <ProfileCard />
          </section>
          <section className="flex flex-col ml-5 w-[58%] max-md:ml-0 max-md:w-full">
            <div className="flex grow gap-5 mt-32 max-md:flex-wrap max-md:mt-10">
              <div className="flex flex-col grow shrink-0 px-5 basis-0 w-fit max-md:max-w-full">
                <h2 className="self-center text-2xl font-semibold leading-8 text-stone-900">Your Posts</h2>
                <PostCard />
              </div>
              <ActionButtons />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default MyComponent;