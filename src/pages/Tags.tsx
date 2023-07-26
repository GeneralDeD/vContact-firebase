import { useEffect, useState } from "react";
import { Button, Modal, Container, Table, Form } from "react-bootstrap";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { useToastStore } from "../store/useToastStore";
import { getDate } from "../shared/utils/getDate";
import Loader from "../widgets/Loader";
import { DeleteModalType, ModalType, TagType } from "../types/TagPageTypes";
import { LIMIT_OPTIONS } from "../shared/consts/LIMIT_OPTIONS";
import CustomPagination from "../widgets/CustomPagination";
import TableActions from "../features/TableActions";
import DeleteModal from "../widgets/DeleteModal";
import TableHeader from "../features/TableHeader";

function Tags() {
  const [pagin, setPagin] = useState({ limit: LIMIT_OPTIONS[0], page: 1 });
  const [modal, setModal] = useState<ModalType>({ isShow: false });
  const [deleteModal, setDeleteModal] = useState<DeleteModalType>({ isShow: false });
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [data, setData] = useState<{ data: TagType[]; total: number }>({ data: [], total: 0 });
  const setInfoToast = useToastStore((store) => store.setInfoToast);

  const fetchData = async () => {
    setIsLoadingData(true);
    const list: TagType[] = [];

    try {
      const coll = collection(db, "tags");
      const querySnapshot = await getDocs(query(coll, orderBy("createdAt", "desc"), limit(pagin.limit)));
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as TagType);
      });
      console.log(list);
      const snapshot = await getCountFromServer(coll);
      setData({ data: list, total: Math.ceil(snapshot.data().count / pagin.limit) });
    } catch (error: any) {
      setInfoToast(true, "Error", error.message, "danger");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagin]);

  const handleCloseModal = () => {
    !isLoadingModal && setModal({ isShow: false });
  };

  const handleCloseDeleteModal = () => {
    !isLoadingModal && setDeleteModal({ isShow: false });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoadingModal(true);

    const data = { title: event.target[0].value, createdAt: serverTimestamp() };

    try {
      if (modal.role === "add") {
        await addDoc(collection(db, "tags"), data);
        setInfoToast(true, "Success", "New tag successfully added", "success");
      } else {
        await setDoc(doc(db, "tags", modal.data?.id as string), data);
        setInfoToast(true, "Success", "Tag successfully edited", "success");
      }
      event.target.reset();
      setModal({ isShow: false });
      fetchData();
    } catch (err: any) {
      setInfoToast(true, "Error", err.message, "danger");
    } finally {
      setIsLoadingModal(false);
    }
  };

  const handleDeleteTag = async () => {
    setIsLoadingModal(true);

    try {
      await deleteDoc(doc(db, "tags", deleteModal.id as string));
      setDeleteModal({ isShow: false });
      setInfoToast(true, "Success", "Tag successfully removed", "success");
      fetchData();
    } catch (err: any) {
      setInfoToast(true, "Error", err.message, "danger");
    } finally {
      setIsLoadingModal(false);
    }
  };

  return (
    <Container fluid="xxl" className="p-3">
      <TableHeader
        title="Tags"
        isLoading={isLoadingData}
        pagin={pagin}
        setPagin={setPagin}
        handleAddTitle="Add new tag"
        handleAddNewItem={() => setModal({ isShow: true, role: "add", title: "Tag adding" })}
      />

      {isLoadingData ? (
        <Loader />
      ) : (
        <>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Tags</th>
                <th>Created at</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data?.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>{getDate(item.createdAt)}</td>
                  <td>
                    <TableActions
                      handleEdit={() => setModal({ isShow: true, role: "edit", title: "Tag editing", data: item })}
                      handleDelete={() => setDeleteModal({ isShow: true, id: item.id })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <CustomPagination total={data.total} pagin={pagin} setPagin={setPagin} />
        </>
      )}

      <Modal show={modal.isShow} onHide={handleCloseModal} onEscapeKeyDown={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{modal?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tag title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tag title here"
                defaultValue={modal?.data?.title}
                required
                disabled={isLoadingModal}
              />
            </Form.Group>
            <div className="d-flex align-items-center justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal} disabled={isLoadingModal}>
                Close
              </Button>
              <Button type="submit" variant="primary" disabled={isLoadingModal}>
                Save Changes {isLoadingModal && <Loader size="sm" />}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <DeleteModal
        show={deleteModal.isShow}
        title="Are you sure to delete this tag?"
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDeleteTag}
        isLoading={isLoadingModal}
      />
    </Container>
  );
}

export default Tags;
