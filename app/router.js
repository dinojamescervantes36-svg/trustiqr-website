

export default function Login() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <>
      ...
    </>
  );
}

function toggleMenu() {
  document.querySelector(".nav-menu").classList.toggle("active");
}

