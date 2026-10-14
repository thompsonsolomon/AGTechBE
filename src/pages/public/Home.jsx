import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import Hero from "../../components/Hero";
import HomeSections from "../../components/HomeSections";

export default function Home() {

  return (
    <>
      <Header />

      <main>
        <Hero />
<HomeSections />
<Footer />
      </main>
    </>
  );
}
