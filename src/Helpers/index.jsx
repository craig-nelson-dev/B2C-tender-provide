import { useTranslation } from "react-i18next";
import { _t } from "../Utils/_t";
import { useEffect, useState } from "react";

const GetTimeDiff = ({date}) => {
  const { t } = useTranslation()
  const [renderDate, setRenderDate] = useState("")

  useEffect(() => {
    const givenDate = new Date(date);
    const today = new Date(new Date().toUTCString());
    const timeDiff = today.getTime() - givenDate.getTime();

    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const monthsDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));
    const yearsDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30 * 12));

    if (yearsDiff >= 1) {
      if (yearsDiff > 1)
        setRenderDate(yearsDiff + ' ' + t(_t('years')))
      else setRenderDate(yearsDiff + ' ' + t(_t('year')))
      return;
    };

    if (monthsDiff >= 1) {
      if (monthsDiff > 1)
        setRenderDate(monthsDiff + ' ' + t(_t('months')))
      else setRenderDate(monthsDiff + ' ' + t(_t('month')))
      return;
    };

    if (daysDiff >= 1) {
      if (daysDiff > 1)
        setRenderDate(daysDiff + ' ' + t(_t('days')))
      else setRenderDate(daysDiff + ' ' + t(_t('day')))
      return;
    };

    if (hoursDiff >= 1) {
      if (hoursDiff > 1)
        setRenderDate(hoursDiff + ' ' + t(_t('hours')))
      else setRenderDate(hoursDiff + ' ' + t(_t('hour')))
      return;
    };

    if (minutesDiff > 1)
      setRenderDate(minutesDiff + ' ' + t(_t('minutes')))
    else setRenderDate(minutesDiff + ' ' + t(_t('minute')))

  }, [date])


  return (
    <span>{renderDate}</span>
  )
}

const isMoreThanAMonth = (date) => {
  const givenDate = new Date(date);
  const today = new Date();
  const timeDiff = today.getTime() - givenDate.getTime();

  const monthsDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));

  if (monthsDiff >= 1) {
    return true;
  };

  return false;
}

export {
  GetTimeDiff,
  isMoreThanAMonth,
};