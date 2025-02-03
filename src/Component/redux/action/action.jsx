
export const getProducts = ()=> async(dispatch)=>{
    try {
        const data = await fetch("http://localhost:3001/product-management/products",{
                method:"GET",
                headers:{
                    "Content-Type":"application/json"
                }
        });
        const res = await data.json();
                
        dispatch({type:"SUCCESS_GET_PRODUCTS",payload:res});
    } catch (error) {
        dispatch({type:"FAIL_GET_PRODUCTS",payload:error.response});
    }
}

export const getinddata = async () => {
    const res = await fetch(`API`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        credentials: "include"
    });

    const data = await res.json();

    if (res.status !== 201) {
        alert("no data available")
    } else {
        // console.log("ind mila hain");
        // setIndedata(data);
    }
};