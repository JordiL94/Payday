import loaderSvg from '../../assets/img/loader.svg'

export function Loader() {
    return (
        <div className="loader">
            <img src={loaderSvg} alt="" />
        </div>
    )
}