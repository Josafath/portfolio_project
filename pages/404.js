import Link from "next/link";

export default function Custom404() {
    return (
        <>
            <section className="pnf" style={{position:"fixed"}}>
                <div className="title_404">404</div>
                <p style={{fontSize:"24px", letterSpacing: "4px"}}>Page Not Found</p>
                <Link href='/' passHref>
                    <span style={{fontSize: "22px", letterSpacing: "2px", cursor:"pointer", textDecoration: "underline"}}>
                        Go back
                    </span>
                </Link>
            </section>
        </>
    )
  }