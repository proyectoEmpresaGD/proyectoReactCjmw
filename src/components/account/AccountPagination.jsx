import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";


const DEFAULT_PAGE_SIZE = 20;


function getVisiblePages(
    currentPage,
    totalPages
) {
    if (
        totalPages <= 7
    ) {
        return Array.from(
            {
                length:
                    totalPages,
            },
            (
                _,
                index
            ) =>
                index + 1
        );
    }


    const pages = [
        1,
    ];


    if (
        currentPage > 4
    ) {
        pages.push(
            "ellipsis-left"
        );
    }


    const start =
        Math.max(
            2,
            currentPage - 1
        );

    const end =
        Math.min(
            totalPages - 1,
            currentPage + 1
        );


    for (
        let page = start;
        page <= end;
        page += 1
    ) {
        pages.push(
            page
        );
    }


    if (
        currentPage <
        totalPages - 3
    ) {
        pages.push(
            "ellipsis-right"
        );
    }


    pages.push(
        totalPages
    );


    return pages;
}


export default function AccountPagination({
    currentPage,
    totalItems,
    onPageChange,
    pageSize =
    DEFAULT_PAGE_SIZE,
}) {
    const totalPages =
        Math.ceil(
            totalItems /
            pageSize
        );


    if (
        totalItems <=
        pageSize
    ) {
        return null;
    }


    const safeCurrentPage =
        Math.min(
            Math.max(
                currentPage,
                1
            ),
            totalPages
        );


    const startItem =
        (
            safeCurrentPage -
            1
        ) *
        pageSize +
        1;

    const endItem =
        Math.min(
            safeCurrentPage *
            pageSize,
            totalItems
        );


    const pages =
        getVisiblePages(
            safeCurrentPage,
            totalPages
        );


    return (
        <nav
            aria-label="Paginación"
            className="
                mt-10
                flex
                flex-col
                gap-5
                border-t
                border-stone-200
                pt-6

                sm:flex-row
                sm:items-center
                sm:justify-between
            "
        >
            <p
                className="
                    text-xs
                    text-stone-400
                "
            >
                Mostrando{" "}

                <span
                    className="
                        font-medium
                        text-stone-700
                    "
                >
                    {startItem}
                    {"–"}
                    {endItem}
                </span>

                {" "}de{" "}

                <span
                    className="
                        font-medium
                        text-stone-700
                    "
                >
                    {totalItems}
                </span>
            </p>


            <div
                className="
                    flex
                    items-center
                    gap-1
                "
            >
                <button
                    type="button"
                    disabled={
                        safeCurrentPage ===
                        1
                    }
                    onClick={() =>
                        onPageChange(
                            safeCurrentPage -
                            1
                        )
                    }
                    aria-label="Página anterior"
                    className="
                        flex
                        h-9
                        items-center
                        gap-1.5
                        px-3
                        text-xs
                        font-medium
                        text-stone-600
                        transition

                        hover:bg-stone-100
                        hover:text-stone-950

                        disabled:pointer-events-none
                        disabled:opacity-30
                    "
                >
                    <ChevronLeft
                        className="
                            h-4
                            w-4
                        "
                    />

                    <span
                        className="
                            hidden

                            sm:inline
                        "
                    >
                        Anterior
                    </span>
                </button>


                {pages.map(
                    (
                        page
                    ) => {
                        if (
                            typeof page !==
                            "number"
                        ) {
                            return (
                                <span
                                    key={
                                        page
                                    }
                                    className="
                                        flex
                                        h-9
                                        w-8
                                        items-center
                                        justify-center
                                        text-xs
                                        text-stone-400
                                    "
                                >
                                    ···
                                </span>
                            );
                        }


                        const isActive =
                            page ===
                            safeCurrentPage;


                        return (
                            <button
                                key={
                                    page
                                }
                                type="button"
                                onClick={() =>
                                    onPageChange(
                                        page
                                    )
                                }
                                aria-current={
                                    isActive
                                        ? "page"
                                        : undefined
                                }
                                className={`
                                    flex
                                    h-9
                                    min-w-9
                                    items-center
                                    justify-center
                                    px-2
                                    text-xs
                                    font-medium
                                    transition

                                    ${isActive
                                        ? `
                                                bg-stone-950
                                                text-white
                                            `
                                        : `
                                                text-stone-500

                                                hover:bg-stone-100
                                                hover:text-stone-950
                                            `
                                    }
                                `}
                            >
                                {page}
                            </button>
                        );
                    }
                )}


                <button
                    type="button"
                    disabled={
                        safeCurrentPage ===
                        totalPages
                    }
                    onClick={() =>
                        onPageChange(
                            safeCurrentPage +
                            1
                        )
                    }
                    aria-label="Página siguiente"
                    className="
                        flex
                        h-9
                        items-center
                        gap-1.5
                        px-3
                        text-xs
                        font-medium
                        text-stone-600
                        transition

                        hover:bg-stone-100
                        hover:text-stone-950

                        disabled:pointer-events-none
                        disabled:opacity-30
                    "
                >
                    <span
                        className="
                            hidden

                            sm:inline
                        "
                    >
                        Siguiente
                    </span>

                    <ChevronRight
                        className="
                            h-4
                            w-4
                        "
                    />
                </button>
            </div>
        </nav>
    );
}