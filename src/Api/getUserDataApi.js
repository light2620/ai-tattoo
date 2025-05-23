
export const getUserDetails = async (dispatch, post,setImageLoading) => {
 try {
            dispatch(setImageLoading(true));
           const response = await post(
             "https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/getUserDetails"
           );
    
           if (response.status === 200) {
             const userData = response?.data?.user;
           
             return userData;           
            }
         } catch (error) {
           throw error;
         }finally {
            dispatch(setImageLoading(false));
         }
    
}