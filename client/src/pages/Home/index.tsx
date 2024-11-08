export default function Home() {
  return (
    <div
      style={{
        backgroundImage: `url("${import.meta.env.VITE_FRONT_END_URL}/background.png")`,
        backgroundRepeat: "no-repeat",
        textShadow: "2px 2px #0984ff",
      }}
      className="flex justify-center items-center gap-5 grow bg-cover bg-center"
    >
      <h1 className="text-white text-[40px] max-w-[300px] text-center lg:text-left">
        Welcome to BKP Service
      </h1>
    </div>
  );
}