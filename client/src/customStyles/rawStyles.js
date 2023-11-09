export const CustominputStyle = {
  '& label': {
    fontFamily: `'Titillium Web', sans-serif`,
    color: 'info.light',
    letterSpacing: '.8px',
    fontSize: '1rem',
    transition: `.5s ease all`,
  },
  '& input': {
    backgroundColor: 'transparent',
    padding: '5px 10px',
    fontSize: '1rem',
    border: 'none',
    outline: 'none',
    letterSpacing: '1px',
    color: 'semiWhite.light',
    transition: `.5s ease all`,
  },
  '&:focus-within label': {
    color: 'info.main',
    fontWeight: 'bold',
    transform: 'translateY(0px)',
  },
  '&:focus-within': {
    borderBottomWidth: '2px',
    borderBottomColor: 'info.main',
    color: 'info.main',
  },
  '&:focus-within input': {
    backgroundColor: 'rgba(0,0,0,.05)',
    padding: '5px 10px',
  },
}
