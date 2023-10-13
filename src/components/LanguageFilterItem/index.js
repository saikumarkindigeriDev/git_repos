// Write your code here
import './index.css'

const LanguageFilterItem = props => {
  const {onChangeFilter, languageDetails, isActive} = props
  const {id, language} = languageDetails

  const btnClassName = isActive
    ? 'language-btn active-language-btn'
    : 'language-btn'

  const onChangeLanguage = () => {
    onChangeFilter(id)
  }

  return (
    <li>
      <button type="button" onClick={onChangeLanguage} className={btnClassName}>
        {language}
      </button>
    </li>
  )
}
export default LanguageFilterItem
