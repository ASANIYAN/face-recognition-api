const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();


const handleApiCall = (req, res, personalAccessToken) => {

    // Change this to whatever model
    const MODEL_ID = 'face-detection';
    
    // add Personal access token here
    const PAT = personalAccessToken;

    // This will be used by every Clarifai endpoint call
    metadata.set("authorization", `Key ${PAT}` );
    
    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": 'clarifai',
                "app_id": 'main'
            },
            model_id: MODEL_ID,
            inputs: [
                { data: { image: { url: req.body.input } } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log(err);
                return res.status(400).json('Error connecting to API'); 
            }
    
            if (response.status.code !== 10000) {
                console.log(response.status.description);
                return res.status(400).json('Failed to complete detection');
                // throw new Error("Post model outputs failed, status: " + response.status.description);
            }
    
            // Since we have one input, one output will exist here.
            const output = response.outputs[0];
            console.log(output)
            return res.json(response);
    
            // console.log("Predicted concepts:");
            // for (const concept of output.data.concepts) {
            //     console.log(concept.name + " " + concept.value);
            // }
        }
    );  
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where( 'id', '=', id)
        .increment('entries', 1)
        .returning('entries')    
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall
}