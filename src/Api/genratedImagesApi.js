
export const getGeneratedImages = async (dispatch,post,setGenratedImagesData) => {
 try {
           const response = await post(
             "https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/getUserDetails"
           );
    
           if (response.status === 200) {
             const userData = response?.data?.user;
             const result = setGenratedImagesData(userData.generateImages);
             console.log(result);
             console.log("Action being dispatched:", result);
             dispatch(result);
           }
         } catch (error) {
           throw error;
         }
    
}