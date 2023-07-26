import { useEffect, useState, useRef } from "react";
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
import Multiselect from "multiselect-react-dropdown";
import { TagType } from "../types/TagPageTypes";
import { ContactType, DeleteModalType, ModalType } from "../types/HomePageTypes";
import { LIMIT_OPTIONS } from "../shared/consts/LIMIT_OPTIONS";
import CustomPagination from "../widgets/CustomPagination";
import TableHeader from "../features/TableHeader";
import TableActions from "../features/TableActions";
import DeleteModal from "../widgets/DeleteModal";

function Home() {
  const selectedTags = useRef(null);
  const [errTagsSelect, setErrTagsSelect] = useState(false);
  const [tagsData, setTagsData] = useState<TagType[]>([]);
  const [pagin, setPagin] = useState({ limit: LIMIT_OPTIONS[0], page: 1 });
  const [modal, setModal] = useState<ModalType>({ isShow: false });
  const [deleteModal, setDeleteModal] = useState<DeleteModalType>({ isShow: false });
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [data, setData] = useState<{ data: ContactType[]; total: number }>({ data: [], total: 0 });
  const setInfoToast = useToastStore((store) => store.setInfoToast);

  const fetchTagsData = async () => {
    const list: TagType[] = [];

    try {
      const coll = collection(db, "tags");
      const querySnapshot = await getDocs(coll);
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as TagType);
      });
      setTagsData(list);
    } catch (error: any) {
      setInfoToast(true, "Error", error.message, "danger");
    }
  };

  useEffect(() => {
    fetchTagsData();
  }, []);

  const fetchData = async () => {
    setIsLoadingData(true);
    const list: ContactType[] = [];

    try {
      const coll = collection(db, "contacts");
      const querySnapshot = await getDocs(query(coll, orderBy("createdAt", "desc"), limit(pagin.limit)));
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as ContactType);
      });
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
    if (!isLoadingModal) {
      setModal({ isShow: false });
      setErrTagsSelect(false);
    }
  };

  const handleCloseDeleteModal = () => {
    !isLoadingModal && setDeleteModal({ isShow: false });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const tags = selectedTags?.current?.state.selectedValues;

    if (tags?.length) {
      setErrTagsSelect(false);
      setIsLoadingModal(true);

      const data = {
        full_name: event.target[0].value,
        email: event.target[1].value,
        phone: event.target[2].value,
        tags: tags as TagType[],
        createdAt: serverTimestamp(),
      };

      try {
        if (modal.role === "add") {
          await addDoc(collection(db, "contacts"), data);
          setInfoToast(true, "Success", "New contact successfully added", "success");
        } else {
          await setDoc(doc(db, "contacts", modal?.data?.id as string), data);
          setInfoToast(true, "Success", "Contact successfully edited", "success");
        }
        event.target.reset();
        setModal({ isShow: false });
        fetchData();
      } catch (err: any) {
        setInfoToast(true, "Error", err.message, "danger");
      } finally {
        setIsLoadingModal(false);
      }
    } else {
      setErrTagsSelect(true);
    }
  };

  const handleDeleteContact = async () => {
    setIsLoadingModal(true);

    try {
      await deleteDoc(doc(db, "contacts", deleteModal.id as string));
      setDeleteModal({ isShow: false });
      setInfoToast(true, "Success", "Contact successfully removed", "success");
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
        title="Contacts"
        isLoading={isLoadingData}
        pagin={pagin}
        setPagin={setPagin}
        handleAddTitle="Add new contact"
        handleAddNewItem={() => setModal({ isShow: true, role: "add", title: "Contact adding" })}
      />

      {isLoadingData ? (
        <Loader />
      ) : (
        <>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Full name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Tags</th>
                <th>Created at</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data?.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.full_name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <Button variant="outline-info" size="sm" key={tag.id} active={true}>
                          {tag.title}
                        </Button>
                      ))}
                    </div>
                  </td>
                  <td>{getDate(item.createdAt)}</td>
                  <td>
                    <TableActions
                      handleEdit={() => setModal({ isShow: true, role: "edit", title: "Contact editing", data: item })}
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
              <Form.Label>Full name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Full name here"
                defaultValue={modal?.data?.full_name}
                required
                disabled={isLoadingModal}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email here"
                defaultValue={modal?.data?.email}
                required
                disabled={isLoadingModal}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Phone here. Ex: +998991234567"
                defaultValue={modal?.data?.phone}
                required
                disabled={isLoadingModal}
                minLength={13}
                maxLength={13}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tags</Form.Label>
              <Multiselect
                ref={selectedTags}
                selectedValues={modal.data?.tags}
                options={tagsData}
                displayValue="title"
                showArrow={true}
                disable={isLoadingModal}
              />
              {errTagsSelect && <small className="text-danger">Please choose a tag(s)</small>}
            </Form.Group>
            <div className="d-flex align-items-center justify-content-end gap-3">
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
        title="Are you sure to delete this contact?"
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDeleteContact}
        isLoading={isLoadingModal}
      />
    </Container>
  );
}

export default Home;
