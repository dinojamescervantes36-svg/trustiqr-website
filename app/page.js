import Login from "@/components/Login";

export default function Home() {
  return (
    <main id="hero">
      <div className="hero-img">
        <img alt="hero-img" src="hero-img.png"/>
      </div>
      <div className="here-Login">
        <Login />
      </div>
    </main>
  );
}
