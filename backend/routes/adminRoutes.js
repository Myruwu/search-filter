const express = require('express')
const router = express.Router()
const {
  getNotes,
  addNotes,
  assignTicket,
  viewTicket,
  getAllTickets,
  getAllAssignTickets,
  registerAdmin,
  loginAdmin,
  getMe,
} = require('../controllers/adminController')

const { protect } = require('../middleware/authMiddleware')
router.get('/notes/:ticketId', getNotes)
router.post('/add/notes/:ticketId', addNotes)
router.post('/', registerAdmin)
router.post('/login', loginAdmin)
router.get('/me', protect, getMe)
router.get("/all", getAllTickets)
router.get("/:id", viewTicket)
router.get("/assign/all/:id", getAllAssignTickets)
router.put("/assign/:id", assignTicket)

module.exports = router
