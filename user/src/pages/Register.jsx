import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { register, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

const Register = () => {
  const [formData, setFormData] = useState({
    studentNumber: '',
    department: '',
    course: '',
    name: '',
    email: '',
    password: '',
    password2: '',
  })

  const { studentNumber,department, course ,name, email, password, password2 } = formData

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    state => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    // Redirect when logged in
    if (isSuccess || user) {
      navigate('/')
    }

    dispatch(reset())
  }, [isError, isSuccess, user, message, navigate, dispatch])

  const onChange = e => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = e => {
    e.preventDefault()
    if (password !== password2) {
      toast.error('Passwords do not match')
    } else {
      const userData = {
        studentNumber,
        department,
        course,
        name,
        email,
        password,
      }

      dispatch(register(userData))
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div>
      <section className='heading'>
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>
      <section className='form'>
        <form onSubmit={onSubmit}>
         {/* Student Number */}
         <div className='form-group'>
            <input
              type='number'
              className='form-control'
              id='studentNumber'
              name='studentNumber'
              value={studentNumber}
              onChange={onChange}
              placeholder='Enter your student number'
              required
            />
          </div>
           {/* Department */}
           <div className='form-group'>
            <input
              type='text'
              className='form-control'
              id='department'
              name='department' 
              value={department}
              onChange={onChange}
              placeholder='Select a department'
              required
            />
          </div>
           {/* Course */}
           <div className='form-group'>
            <input
              type='text'
              className='form-control'
              id='course'
              name='course' 
              value={course}
              onChange={onChange}
              placeholder='Select a course'
              required
            />
          </div>
          {/* Name */}
          <div className='form-group'>
            <input
              type='text'
              className='form-control'
              id='name'
              name='name' // this is going to onChange func
              value={name}
              onChange={onChange}
              placeholder='Enter your name'
              required
            />
          </div>

          {/* Email */}
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email' // this is going to onChange func
              value={email}
              onChange={onChange}
              placeholder='Enter your email'
              required
            />
          </div>

          {/* Password */}
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password' // this is going to onChange func
              value={password}
              onChange={onChange}
              placeholder='Enter password'
              required
            />
          </div>

          {/* Password2 */}
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password2'
              name='password2' // this is going to onChange func
              value={password2}
              onChange={onChange}
              placeholder='Confirm password'
              required
            />
          </div>

          <div className='form-group'>
            <button className='btn btn-block'>Submit</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default Register
