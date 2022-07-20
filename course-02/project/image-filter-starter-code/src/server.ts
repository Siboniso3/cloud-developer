import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  
  const url ="/filteredimage/";

  //Root Endpoint
  app.get(url, async(req, res)=>{
       const {image_url} =req.query;
       //validate the image url
       if(!image_url){
        //if not valid url, return status 400 bad request
        return res.status(400).json({ValidityState: true, message: "Invalid image url..."})
       }
       
       try{
         let imageFile = await filterImageFromURL(image_url);
         //if success return status 200,  in downloading the image
         return res.status(200).sendFile(imageFile, () =>{
          deleteLocalFiles([imageFile]);
         })
       }catch(err){
        //bad request, server failed to load the imageFile

        return res.status(400).json({ValidityState:true, message:"The was  error trying processing Image url"});
       }
  });



  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();