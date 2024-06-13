const File = require("../models/fileModel")
const cloudinary = require('cloudinary').v2;


const fileUpload = async (req, res)=>{

    try{
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path);

            const fileMetadata = {
               // name: req.file.originalname,
                name: req.body.title,
                link: result.secure_url,
                size: req.file.size.toString(),
                creation_date: new Date().toISOString(),
                cloudinary_id: result.public_id
              };
              
              const file = new File(fileMetadata);
              await file.save();
        
            res.status(200).send({ status: "success", message: `${req.file.originalname} uploaded!` })
        }
        else{
            res.status(404).send({ status: "error", message: `File not found!` })
        }
    } catch(err){
        console.log(err)
        res.status(500).send({ status: "err", error: err })
    }
}

const getAllFiles = async(req,res)=>{

    try{
        const files = await File.find({})
        res.status(200).send(files)
    }catch(err){
        res.status(500).send({message : err.message})
    }
}

const getSingleFile = async(req,res)=>{
   
    try{
        const {id} = req.params;
     
        const data = await File.findById(id)

        if(data){
            res.status(200).send(data)
        }else{
            res.status(400).send({message : "File not found"})
        }

  }catch(err){
        res.status(500).send({message : err.message})
    }
}




const fileEdit = async (req, res) => {
    
    const { id } = req.params;
   
    console.log(req.body)
    try {
      
        const updateData = { 
            name:  req.body.title 
        };
       
          const existingFile = await File.findById(id);
           
          if (!existingFile) {
               
            return res.status(404).send({ status: "error", message: "File not found!" });
           
            }else{

                if (req.file) {
                    console.log("id")
                    await cloudinary.uploader.destroy(existingFile.cloudinary_id);
        
                    const result = await cloudinary.uploader.upload(req.file.path);
        
                    updateData.link = result.secure_url;
                    updateData.size = req.file.size.toString();
                    updateData.cloudinary_id = result.public_id;
                }
        
       const updatedFile = await File.findByIdAndUpdate(id, updateData, { new: true });
        
      res.status(200).send({ status: "success", message: "File updated successfully!", file: updatedFile });

            }

      

    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "error", error: err.message });
    }
};

// const fileEdit = async (req, res) => {
    
//     const { id } = req.params;
//     console.log(req.body);

//     try {
//         const updateData = {};
//         if (req.body.title) {
//             updateData.name = req.body.title;
//         }

//         if (req.file) {
//             // Find the existing file to get the Cloudinary ID for deletion
//             const existingFile = await File.findById(id);
//             console.log("ex",existingFile)
//             if (!existingFile) {
//                 return res.status(404).send({ status: "error", message: "File not found!" });
//             }

//             // Delete the old file from Cloudinary
//             await cloudinary.uploader.destroy(existingFile.cloudinary_id);

//             // Upload the new file to Cloudinary
//             const result = await cloudinary.uploader.upload(req.file.path);

//             // Update file details
//             updateData.link = result.secure_url;
//             updateData.size = req.file.size.toString();
//             updateData.cloudinary_id = result.public_id;
//         }

//         const updatedFile = await File.findByIdAndUpdate(id, updateData, { new: true });

//         if (!updatedFile) {
//             return res.status(404).send({ status: "error", message: "File not found!" });
//         }

//         res.status(200).send({ status: "success", message: "File updated successfully!", file: updatedFile });

//     } catch (err) {
//         console.log(err);
//         res.status(500).send({ status: "error", error: err.message });
//     }
// };


const deleteFile = async(req,res)=>{
   
    try{
        const {id} = req.params;
     
        const data = await File.findByIdAndDelete(id)

        res.status(200).send({message : "File deleted",data})
    }catch(err){
        res.status(500).send({message : err.message})
    }
}


module.exports =  {fileUpload,getAllFiles,fileEdit,deleteFile,getSingleFile};
