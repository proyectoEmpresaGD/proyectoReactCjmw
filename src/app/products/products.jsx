import { Header } from "../../components/header"
import Footer from "../../components/footer"
import CardProduct from "../../components/cardProduct"

function Product() {

    return (
        <>
            <Header />
            <div className="mx-auto">
            <h1 className=" mx-auto mt-[10%]">PRODUCTS</h1>
            </div>
            
            <div className="sticky xl:top-[30%] lg:top-[30%] h-[70%] overflow-y-auto w-64 bg-white border-slate-400 border-2 p-4">
                <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">BRAND</p>
                    <div className="flex flex-col space-y-2">
                        <label className="flex items-center">
                            <input type="checkbox" className="form-checkbox"/>ALL BRANDS
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="form-checkbox"/>ALL BRANDS
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="form-checkbox"/>ALL BRANDS
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="form-checkbox"/>ALL BRANDS
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="form-checkbox"/>ALL BRANDS
                        </label>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap">
                <CardProduct />
                <CardProduct />
                <CardProduct />
                <CardProduct />
                <CardProduct />
                <CardProduct />
                <CardProduct />
            </div>


            <Footer />
        </>
    )
}
export default Product