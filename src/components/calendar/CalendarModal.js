import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2'
import { uiCloseModal } from '../../actions/ui';
import { eventAddNew, eventCleanActive, eventDeleted, eventUpdated } from '../../actions/events';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

const now = moment().minutes(0).second(0).add(1, 'hours');
const nowPlus1 = now.clone().add(1, 'hours');

const initEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: nowPlus1.toDate()
}

export const CalendarModal = () => {

    const dispatch = useDispatch();
    const { modalOpen } = useSelector( state => state.ui );
    const { activeEvent } = useSelector( state => state.calendar );

    const [dateStart, setDateStart] = useState(now.toDate());
    const [dateEnd, setDateEnd] = useState(nowPlus1.toDate());
    const [titleValid, setTitleValid] = useState(true);

    const [formValues, setFormValues] = useState(initEvent);

    const { title, notes, start, end } = formValues;

    useEffect(() => {
      if(activeEvent) {
          setFormValues(activeEvent)
          setDateStart(activeEvent.start)
          setDateEnd(activeEvent.end)
      } else {
          setFormValues(initEvent)
      }
    }, [activeEvent, setFormValues])
    

    const handleInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }
    const closeModal = () => {
        dispatch(uiCloseModal());
        dispatch(eventCleanActive());
        setFormValues(initEvent);
    }

    const handleChangeStartDate = (e) => { 
        const oneHourOfDiference = moment(e).add(1,'hours').toDate();
        setDateStart(e);
        setDateEnd(oneHourOfDiference)
        setFormValues({
            ...formValues,
            start: e,
            end: oneHourOfDiference
    
        })
    }
    const handleChangeEndDate = (e) => { 
        setDateEnd(e);
        setFormValues({
            ...formValues,
            end: e
        })
    }

    const handleSubmitForm = (e) => {
        e.preventDefault();

        const momentStart = moment(start);
        const momentEnd = moment(end);
        if(momentStart.isSameOrAfter(momentEnd)){
            return Swal.fire('Error', 'La Fecha fin debe ser mayor a la fecha de inicio', 'error');
        }

        if(title.trim().length < 2){
            return setTitleValid(false);
        }

        if(activeEvent) {
            dispatch(eventUpdated(formValues))
        } else {
            dispatch(eventAddNew({
                ...formValues,
                id: new Date().getTime()
            }))
        }

        setTitleValid(true);
        closeModal();
    }

    const handleDeleteEvent = () => {
        dispatch(eventDeleted());
        closeModal();
    }

    return (
        <Modal
            isOpen={modalOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            className = "modal"
            closeTimeoutMS={200}
            overlayClassName = "modal-fondo"
        >
            
            {
                activeEvent &&
                <div className = "icons-btn-container">
                    <i className="fa-solid fa-trash" onClick = { handleDeleteEvent }></i>
                </div>
            }
            <form className="container" onSubmit = { handleSubmitForm }>
                <div className="form-group">
                    <input 
                        type="text" 
                        className={`form-control modal-title-input ${!titleValid && 'is-invalid'}`}
                        placeholder="Añade un título"
                        name="title"
                        autoComplete="off"
                        value = {title}
                        onChange = { handleInputChange }
                        />
                </div>

                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker 
                        onChange={handleChangeStartDate} 
                        value={dateStart}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker 
                        className="form-control" 
                        onChange={handleChangeEndDate}
                        value={dateEnd}
                        minDate = {dateStart}
                    />
                </div>

                <hr />

                <div className="form-group">
                    {/* <small id="emailHelp" className="form-text text-muted">Una descripción corta</small> */}
                    <label>Descripción</label>
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value = { notes }
                        onChange = { handleInputChange }
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
        </Modal>
    )
}
