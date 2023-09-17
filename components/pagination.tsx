import React, { CSSProperties } from "react";
import styles from "components/GenericDropdown.module.scss";
import Button from '@/components/Button';
import {
  Log,
} from '@/components/utils';
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  id?: string;
  style?: CSSProperties;
  totalItems?: number;
  dropdownRef?: React.MutableRefObject<HTMLDivElement>;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  id,
  style,
  totalItems,
  dropdownRef,
}: PaginationProps) {
  const [showChevrons, setShowChevrons] = React.useState<boolean>(true);

  React.useEffect(() => {
    setShowChevrons(totalPages > 10);
  }, [totalPages]);

  let pageNumbers: Array<number>;
  if (totalPages > 10) {
    if (currentPage < 6) {
      pageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    } else if (currentPage > totalPages - 5) {
      pageNumbers = [
        totalPages - 9,
        totalPages - 8,
        totalPages - 7,
        totalPages - 6,
        totalPages - 5,
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    } else {
      pageNumbers = [
        currentPage - 4,
        currentPage - 3,
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
        currentPage + 3,
        currentPage + 4,
        currentPage + 5,
      ];
    }
  } else {
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) {
      return;
    }
    onPageChange(page);
  }

  function handleHideDropdown(e) {
    if (dropdownRef) {
      const container = dropdownRef.current.querySelector(`[class*="${styles["dd-container"]}"]`) as HTMLElement;
      container.style.visibility = 'hidden';
    }
  }

  return totalPages > 1 ? (
    <div id={id} className={styles["paginationDiv"]} style={style}>
      <div className="tfoot">
        <div
          className="tr tfoot"
          style={{
            height: "50px",
            textAlign: "center",
            justifyContent: "center",
            fontSize: '9px'
          }}
        >
          <p key={currentPage} style={{ color: "", fontSize: '9px'  }}>
            Page <br />
            {currentPage}&nbsp;of {totalPages}
            <br />({totalItems} items)
          </p>
          {(dropdownRef && process.env.NODE_ENV === 'development' && <Button onClick={handleHideDropdown} Name={"Hide Me"} />)}
          {showChevrons && (
            <><button style={{ backgroundColor: 'transparent' }} onClick={() => handlePageChange(1)} className='mr1 ml1'><span
              className={`material-symbols-outlined ${"white"} nmnp`}
              style={{ fontSize: '9px' }}
            >
              chevron_left
            </span>
            <span
            className={`material-symbols-outlined ${"white"} nmnp`}
            style={{ fontSize: '9px' }}
          >
            chevron_left
          </span></button></>
          )}
          {showChevrons && (
            <span
              className={`material-symbols-outlined ${"white"} nmnp mr1`}
              onClick={() => handlePageChange(currentPage - 1)}
              style={{ fontSize: '9px' }}
            >
              chevron_left
            </span>
          )}
          {pageNumbers.map((pageNumber) => (
            <button
              id={`button${pageNumber}`}
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`${
                pageNumber === currentPage ? "active-button" : "button"
              } ${"td"}`}
              style={{ fontSize: '9px' }}
            >
              {pageNumber}
            </button>
          ))}

          {showChevrons && (
            <span
              className={`material-symbols-outlined ${"white"} nmnp ml1`}
              style={{ fontSize: '9px' }}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              chevron_right
            </span>
          )}
          {showChevrons && (
            <><button style={{ backgroundColor: 'transparent'}} onClick={() => handlePageChange(totalPages - 1)} className='mr1 ml1'><span
              className={`material-symbols-outlined ${"white"} nmnp ml1`}
              style={{ fontSize: '9px' }}
            >
              chevron_right
            </span>
            <span
            className={`material-symbols-outlined ${"white"} nmnp mr1`}
            style={{ fontSize: '9px' }}
          >
            chevron_right
          </span></button></>
          )}
        </div>
      </div>
    </div>
  ) : null;
}
