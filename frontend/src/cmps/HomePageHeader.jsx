import { Link } from "react-router-dom"


export function HomePageHeader(){
    return(
        <section className="homepage-header">
        <nav>
            <Link className="header-link" to={'/signup'}>Sign up / Log in</Link>
        </nav>
        </section>
    )
}