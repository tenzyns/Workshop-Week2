//load the 'express' module which makes writing webservers easy
const express = require('express');
const { get } = require('http');

const app = express();

app.use(express.json());

const albumsData = [
    {
        albumId: "10",
        artistName: "Beyoncé",
        collectionName: "Lemonade",
        artworkUrl100:
            "http://is1.mzstatic.com/image/thumb/Music20/v4/23/c1/9e/23c19e53-783f-ae47-7212-03cc9998bd84/source/100x100bb.jpg",
        releaseDate: "2016-04-25T07:00:00Z",
        primaryGenreName: "Pop",
        url: "https://www.youtube.com/embed/PeonBmeFR8o?rel=0&amp;controls=0&amp;showinfo=0",
    },
    {
        albumId: "11",
        artistName: "Beyoncé",
        collectionName: "Dangerously In Love",
        artworkUrl100:
            "http://is1.mzstatic.com/image/thumb/Music/v4/18/93/6d/18936d85-8f6b-7597-87ef-62c4c5211298/source/100x100bb.jpg",
        releaseDate: "2003-06-24T07:00:00Z",
        primaryGenreName: "Pop",
        url: "https://www.youtube.com/embed/ViwtNLUqkMY?rel=0&amp;controls=0&amp;showinfo=0",
    },
    {
        albumId: "12",
        artistName: "Beyoncé",
        collectionName: "Lemonade two",
        artworkUrl100:
            "http://is1.mzstatic.com/image/thumb/Music20/v4/23/c1/9e/23c19e53-783f-ae47-7212-03cc9998bd84/source/100x100bb.jpg",
        releaseDate: "2016-04-25T07:00:00Z",
        primaryGenreName: "Pop",
        url: "https://www.youtube.com/embed/PeonBmeFR8o?rel=0&amp;controls=0&amp;showinfo=0",
    }
];

app.get("/albums/:albumId", function (req, res) {
    // const id = parseInt(req.params.albumId);

    const filteredAlbum = albumsData.filter(album => album.albumId === req.params.albumId);
    if (filteredAlbum.length !== 0){ 
    res.json(filteredAlbum);
} else {
    res.status(404).send({msg: "No album found!"})
}
});

app.get("/albums", (req, res) => {
    res.send(albumsData);
});

let newId = 13;

app.post("/albums", (req, res) => {
    const newAlbum = {
        albumId: newId,
        artistName: req.body.artistName,
        collectionName: req.body.collectionName,
        artworkUrl100: req.body.artworkUrl100,
        releaseDate: req.body.releaseDate,
        primaryGenreName: req.body.primaryGenreName,
        url: req.body.url
    }
    if (albumsData.find(album => { 
        if (album.albumId === newAlbum.albumId || album.artistName === newAlbum.artistName
            && album.collectionName === newAlbum.collectionName) {
            return true;
            }
        }))
     {
        res.status(409).send({ msg: "Album already exist!" })
    } else if (newAlbum.artistName && newAlbum.collectionName && newAlbum.artworkUrl100 && newAlbum.url && newAlbum.releaseDate) {
        albumsData.push(newAlbum);
        res.status(201).send(newAlbum);
    } else {
        res.status(400).send({msg: "Album data incomplete!"});
    }
    newId++;
    
});

app.get('/', function (req, res) {
    res.send("hello Express world!")
});

app.put('/albums/:albumId', function (req, res) {
    const albumId = req.params.albumId;
    const albumIndex = albumsData.findIndex(album => album.albumId === albumId);
    if (albumIndex >= 0) {
        const oldAlbum = albumsData[albumIndex];
        const updatedAlbum = req.body;
        let allowedUpdates = {};
        //------Data validation----
        //preventing id update
        if (updatedAlbum.albumId && updatedAlbum.albumId !== oldAlbum.albumId) {
            res.status(400).json({ msg: "Album id update is NOT allowed!" })
        } else {
            //preventing addition of new property
            Object.keys(updatedAlbum).forEach(key => {
                if (oldAlbum.hasOwnProperty(key)) {
                    allowedUpdates[key] = updatedAlbum[key];
                } else {
                    res.status(400).json({ msg: "Adding new property is NOT allowed!" })
                }
            });
            const newAlbum = { ...oldAlbum, ...allowedUpdates };
            albumsData[albumIndex] = newAlbum;
            res.status(200).json({
                message: "Album is successfully updated!",
                newAlbum : newAlbum
            });
        }
    } else {
        res.status(404).json({ msg: "Album not found" })
        }
  /*---alternate codes-----
  const updatedAlbum = req.body;
    if (albumsData.find(album => album.albumId === albumId)) {
        albumsData.forEach(album => {
            if (album.albumId === albumId) {
                album.artistName = updatedAlbum.artistName ? updatedAlbum.artistName : album.artistName;
                album.collectionName = updatedAlbum.collectionName ? updatedAlbum.collectionName : album.collectionName;
                album.artworkUrl100 = updatedAlbum.artworkUrl100 ? updatedAlbum.artworkUrl100 : album.artworkUrl100;
                album.primaryGenreName = updatedAlbum.primaryGenreName ? updatedAlbum.primaryGenreName : album.primaryGenreName;
                album.url = updatedAlbum.url ? updatedAlbum.url : album.url;
                album.releaseDate = updatedAlbum.releaseDate ? updatedAlbum.releaseDate : album.releaseDate;
            }
        })
        res.status(202).send(updatedAlbum);
    } else {
        res.status(404).send({msg: "Album not found!"});
    }
    */

    
});


app.delete("/albums/:albumId", (req, res) => {
    const albumId = req.params.albumId;
    const albumIndex = albumsData.findIndex(album => album.albumId === albumId);
    if (albumIndex === -1) {
        res.status(404).json("Album ID not found!");
    } else {
        albumsData.splice(albumIndex, 1);
        res.status(200).json("Success: true");
    }

})


//Start our server so that it listens for HTTP requests!
const listener = app.listen(process.env.PORT, () =>
 console.log("Server starting at port " + listener.address().port));