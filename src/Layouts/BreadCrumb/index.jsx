import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { useEffect, useState } from "react";
import { getCountDealsService } from "../../Services/Deal";
import { useTranslation } from "react-i18next";
import { _t } from "../../Utils/_t";

function MyBreadcrumb({ categories, categorySlug }) {
  const { t } = useTranslation();
  const [breads, setBreads] = useState([]);
  const [dspDeal, setDspDeal] = useState("");
  const themeColor = 'blue.500';

  // const getCategoryBreadcrumb = (category, breadcrumb = []) => {
  //   if (category.parent_id > 0) {
  //     breadcrumb.push(category);
  //     return getCategoryBreadcrumb(categories?.filter((item) => item.id === category.parent_id), breadcrumb);
  //   }
  //   return breadcrumb.reverse();
  // };

  // const breadcrumb = getCategoryBreadcrumb(categories?.filter((item) => item.slug === categorySlug));
  useEffect(() => {
    setBreadCrumb();
  }, [categories, categorySlug])

  const setBreadCrumb = async () => {
    if (categories && categories.length && categorySlug) {
      var curId = categories.find(v => (v.slug === categorySlug));
      curId = curId.id;
      var tId = curId;
      var tBreads = [];
      while (tId !== -1) {
        tBreads.unshift(getCategoryById(tId));
        tId = getCategoryById(tId).parent_id;
      }
      setBreads(tBreads)

      var allChildren = getAllChildren(curId);
      var countDeal = await getCountDealsService(allChildren);
      setDspDeal(` (${countDeal} ${t(_t("deal"))}${countDeal > 1 ? "s" : ""})`);
      return curId;
    } else {
      setBreads([])
      return -1;
    }
  }

  function getAllChildren(id) {
    // var res = [];
    var que = [id];
    var index = 0;
    while (index < que.length) {
      var cur = que[index];
      // var isParent = false;
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].parent_id === cur && categories[i].status) {
          que.push(categories[i].id);
          // isParent = true;
        }
      }
      // if (!isParent)
      //   res.push(cur);
      index++;
    }
    return que;
  }

  const getCategoryById = (id) => {
    return categories.find(v => (v.id === id))
  }

  return (
    <Breadcrumb
      separator=">"
      p={5}
      fontSize={'0.9em'}>
      <BreadcrumbItem>
        <BreadcrumbLink
          as={Link} to="/"
          color={themeColor}
        >
          <Icon as={MdHome} boxSize={6} mt={1} />
        </BreadcrumbLink>
      </BreadcrumbItem>
      {
        breads.map((v, idx) => (
          idx !== breads.length - 1 ?
            <BreadcrumbItem key={idx}>
              <BreadcrumbLink
                as={Link}
                key={idx}
                to={"/categoria/" + v.slug}
              >
                {v.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            :
            <BreadcrumbItem key={idx} isCurrentPage>
              <BreadcrumbLink as={Link} key={idx} to={"/categoria/" + v.slug}>
                {v.name + " " + dspDeal}
              </BreadcrumbLink>
            </BreadcrumbItem>
        ))
      }
    </Breadcrumb>
  );
}

export default MyBreadcrumb;