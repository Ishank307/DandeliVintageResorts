"use client"

import { useState } from "react"
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { TextField } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'

// Custom theme matching your design
const theme = createTheme({
    palette: {
        primary: {
            main: '#2672c8ff', //500
        },
        background: {
            paper: '#ffffff',
        },
        text: {
            primary: '#111827', // gray-900
            secondary: '#6b7280', // gray-500
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '0.5rem',
                        color: '#111827', // Dark text for light background
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                            borderWidth: '2px',
                        },
                        '& input': {
                            color: '#111827', // Ensure input text is dark
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#6b7280',
                        '&.Mui-focused': {
                            color: '#eab308',
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: '#111827',
                    },
                },
            },
        },
        MuiPickersDay: {
            styleOverrides: {
                root: {
                    color: '#111827',
                    '&.Mui-selected': {
                        backgroundColor: '#eab308',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#ca8a04',
                        },
                    },
                },
            },
        },
    },
})

export default function BirthDatePicker({ value, onChange, label, error }) {
    const isMobile = useMediaQuery('(max-width:640px)')
    const [dateValue, setDateValue] = useState(value ? dayjs(value) : null)

    const handleChange = (newValue) => {
        setDateValue(newValue)
        if (newValue) {
            // Convert dayjs to ISO string format (YYYY-MM-DD)
            onChange(newValue.format('YYYY-MM-DD'))
        } else {
            onChange('')
        }
    }

    const maxDate = dayjs() // Today
    const minDate = dayjs().subtract(100, 'year') // 100 years ago

    const DatePickerComponent = isMobile ? MobileDatePicker : DesktopDatePicker

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-white drop-shadow-md mb-2">
                    {label}
                </label>
            )}
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePickerComponent
                        value={dateValue}
                        onChange={handleChange}
                        maxDate={maxDate}
                        minDate={minDate}
                        format="DD/MM/YYYY"
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                placeholder: "Select your date of birth",
                                error: !!error,
                                helperText: error,
                                sx: {
                                    '& .MuiOutlinedInput-root': {
                                        paddingY: '6px',
                                    },
                                },
                            },
                            actionBar: {
                                actions: ['clear', 'today', 'accept'],
                            },
                        }}
                        views={['year', 'month', 'day']}
                        openTo="year"
                    />
                </LocalizationProvider>
            </ThemeProvider>
        </div>
    )
}
