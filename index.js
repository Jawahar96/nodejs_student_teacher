const express = require('express');

const app = express()

const mongodb =require('mongodb')

const mongoClient = mongodb.MongoClient

const dotenv =require('dotenv').config
const DB = process.env.DB

// const url = ("mongodb+srv://jawaharsabesan:v8nD8vdq8JsqAKyb@cluster0.n6dtkg8.mongodb.net/?retryWrites=true&w=majority")

const bodyParser=require('body-parser');
const { connect } = require('mongoose');

app.use(express.urlencoded({extended: "true"}))


app.use(express.json())

const PORT = process.env.PORT || 3002

app.get('/',function(req,res){
    res.json({message : "WELCOME TO STUDENT AND  TEACHER ADMIN"})
})

// create  api for mentor
app.post('/mentor', async function(req,res){
    try{
const connection =  await mongoClient.connect(url)
const db =connection.db(DB)
    let mentors =await  db.collection("mentor").insertOne(req.body)

    res.json(mentors)

    await connection.close()
    res.json({message : "Mentor details are inserted"})
    }catch(error){
        console.log(error);
        res.status(500).json({message : "Data are not connected .please check the connection"})
    }
 
    // creata a api for student

    app.post('/student' , async function(req,res){
        try{
        const connection =  await mongoClient.connect(url)
        const db =connection.db(DB)
        let students= await db.collection("students").insertOne(req.body)
        res.json(students)
        await connection.close()
        res.json({message : "Student details are inserted"})
        }catch(error){
            console.log(error);
            res.status(500).json({message : "Student data are not inserted ,check the connection"})
        }

        //select one mentor with multiple student
        app.post('/mentorwithstudent',async function(req,res){
            try{
            const connection =  await mongoClient.connect(url)
            const db= connection.db(DB)
            const std = await db.collection("students").find(req.params.student_id)
            std.mentors = req.params.mentors_id
            const updatestd =   await student.save()
            res.json(updatestd)
            await connection.close()
            res.json({message : "Assingned the students with mentors"})
            }catch(error){
                console.log(error);
                res.status(500).json({message : "Students are not assigning with mentor properly"})
            }

        })
// student who has a mentor should not shown in list

  app.put('/changementor',async function(req,res){
    try{
const connection =await mongoClient.connect(url)
const db=connection.db(DB)
let stdupdate =await db.collection("stdnts").findOne(req.params.student_id)
const updatedstd = await stdupdate.findandUpdate(stdupdate,{mentors : req.params.mentors_id},{new : true})

await connection.close()
res.json(updatedstd)
    }catch(error){
        console.log(error);
        res.status(500).json({message : "Student who are mentoes are not shown the list properly."})
    }
 })
// get student with mentor

app.get('/studentdetail',async function(req,res)
{
    try{

        const connection = await mongoClient.connect(url)
        const db = connection.db(DB)
        const student = await db.collection("students").find({mentors : req.params.mentors_id})
        await connection.close()
        res.json(student)
    }catch(error){
        console.log(error);
        res.status(500).json({message : "Error occure! .........."})
    }


})

// get the mentors details by id

app.get('/mentordetails',async function(req,res){
    try{
        const connection = await mongoClient.connect(url)
        const db =connection.db(DB)
        let mentor =await db.collection("mentors").findOne({_id : req.params.id})
        await connection.close()
        res.json(mentor)
    }catch(error){
        console.log(error);
        res.status(500).json({message : "something went wrong"})
    }
    })
})

})



app.listen(PORT,()=>{
    console.log(`server is running on the port ${PORT}`);
})