const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Admin = require('../models/adminModel')
const Note = require('../models/noteModel')
const Ticket = require('../models/ticketModel')

const registerAdmin = asyncHandler(async (req, res) => {
  const { 
    name, 
    email, 
    password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please include all fields')
  }
  const adminExists = await Admin.findOne({ email })

  if (adminExists) {
    res.status(400)
    throw new Error('admin already exists')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const admin = await Admin.create({
    name,
    email,
    password: hashedPassword,
  })

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    })
  } else {
    res.status(400)
    throw new error('Invalid admin data')
  }
})

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const admin = await Admin.findOne({ email })

  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.status(200).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    })
  } else {
    res.status(404)
    throw new Error('Invalid credentials')
  }
})

const getMe = asyncHandler(async (req, res) => {
  const admin = {
    id: req.admin._id,
    email: req.admin.email,
    name: req.admin.name,
  }

  res.status(200).json(admin)
})

const generateToken = id => {
  return jwt.sign({ id }, "important", {
    expiresIn: '30d',
  })
}


const getAllTickets = asyncHandler(async (req, res) => {

  const tickets = await Ticket.find()

  if (!tickets) {
    res.status(401)
    throw new Error('There is no tickets')
  }

  res.status(200).json(tickets)
})

const viewTicket = asyncHandler(async (req, res) => {


  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  res.status(200).json(ticket)
})

const getNotes = asyncHandler(async (req, res) => {



  const notes = await Note.find({ ticket: req.params.ticketId })

  res.status(200).json(notes)
})

const addNotes = asyncHandler(async (req, res) => {
  const user = await Admin.findById(req.body.user)

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const note = await Note.create({
    text: req.body.text,
    isStaff: true,
    ticket: req.params.ticketId,
    user: req.body.user,
  })

  res.status(200).json(note)
})

const assignTicket = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.body.admin)

  if (!admin) {
    res.status(401)
    throw new Error('User not found')
  }

  const ticket = await Ticket.findById(req.params.id, {admin: admin})
  if(!ticket) {
    const data = await Ticket.findByIdAndUpdate(req.params.id, {
      admin: req.body.admin,
    })
    res.status(200).json(data)
  } else{
    const data = await Ticket.findByIdAndUpdate(req.params.id, {
      admin: null,
    })
    res.status(200).json(data)
  }
  
})

const getAllAssignTickets = asyncHandler(async (req,res) => {
  const admin = await Admin.findById(req.params.id)

  const ticket = await Ticket.find({admin: admin})
  res.status(200).json(ticket)
})

module.exports = {
  getNotes,
  addNotes,
  viewTicket,
  assignTicket,
  getAllTickets,
  getAllAssignTickets,
  registerAdmin,
  loginAdmin,
  getMe,
}
